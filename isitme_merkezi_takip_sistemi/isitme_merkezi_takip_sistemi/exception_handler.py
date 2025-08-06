from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from rest_framework.exceptions import ValidationError, NotAuthenticated, PermissionDenied

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        # Validation error
        if isinstance(exc, ValidationError):
            response.data = {
                'hata': 'Doğrulama hatası',
                'detay': response.data
            }
            response.status_code = status.HTTP_400_BAD_REQUEST
        # Not authenticated
        elif isinstance(exc, NotAuthenticated):
            response.data = {
                'hata': 'Kimlik doğrulama gerekli',
                'detay': 'Bu işlemi yapmak için giriş yapmalısınız.'
            }
            response.status_code = status.HTTP_401_UNAUTHORIZED
        # Permission denied
        elif isinstance(exc, PermissionDenied):
            response.data = {
                'hata': 'Yetki reddedildi',
                'detay': 'Bu işlemi yapmak için yeterli yetkiniz yok.'
            }
            response.status_code = status.HTTP_403_FORBIDDEN
        # Not found
        elif isinstance(exc, Http404):
            response.data = {
                'hata': 'Kayıt bulunamadı',
                'detay': 'İlgili kayıt sistemde bulunamadı.'
            }
            response.status_code = status.HTTP_404_NOT_FOUND
        # Diğer hatalar
        else:
            response.data = {
                'hata': 'İşlem sırasında bir hata oluştu',
                'detay': response.data
            }
    else:
        # Sunucu hatası (ör. 500)
        return Response({
            'hata': 'Sunucu hatası',
            'detay': 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response