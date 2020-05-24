from rest_framework import authentication, exceptions
from oauth2_provider.models import AccessToken
from rest_framework.authtoken.models import Token
from django.utils.translation import gettext_lazy as _

class TokenAuthentication(authentication.TokenAuthentication):
    model = AccessToken
    model2 = Token

    def authenticate_credentials(self, key):
        model = self.get_model()
        model2 = Token

        try:
            token = model.objects.select_related('user').get(token=key)
        except model.DoesNotExist:
            try:
                token = model2.objects.select_related('user').get(key=key)
            except model.DoesNotExist:
                raise exceptions.AuthenticationFailed(_('Invalid token.'))

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))

        return (token.user, token)
