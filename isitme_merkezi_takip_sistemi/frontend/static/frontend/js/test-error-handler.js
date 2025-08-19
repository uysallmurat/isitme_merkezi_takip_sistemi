        // Test sonuçları için global değişken
        let testResults = [];

        // Bildirim testleri
        function testSuccessNotification() {
            errorHandler.showSuccess('Bu bir başarı bildirimidir!');
            addTestResult('Bildirim Testi', 'Başarı bildirimi gösterildi', 'success');
        }

        function testErrorNotification() {
            errorHandler.showError('Bu bir hata bildirimidir!');
            addTestResult('Bildirim Testi', 'Hata bildirimi gösterildi', 'error');
        }

        function testWarningNotification() {
            errorHandler.showWarning('Bu bir uyarı bildirimidir!');
            addTestResult('Bildirim Testi', 'Uyarı bildirimi gösterildi', 'warning');
        }

        function testInfoNotification() {
            errorHandler.showInfo('Bu bir bilgi bildirimidir!');
            addTestResult('Bildirim Testi', 'Bilgi bildirimi gösterildi', 'info');
        }

        function testMultipleNotifications() {
            errorHandler.showSuccess('İlk bildirim');
            setTimeout(() => errorHandler.showError('İkinci bildirim'), 500);
            setTimeout(() => errorHandler.showWarning('Üçüncü bildirim'), 1000);
            setTimeout(() => errorHandler.showInfo('Dördüncü bildirim'), 1500);
            addTestResult('Bildirim Testi', 'Çoklu bildirimler gösterildi', 'info');
        }

        function clearAllNotifications() {
            // errorHandler'da clearNotifications metodu varsa kullan
            if (typeof errorHandler.clearNotifications === 'function') {
                errorHandler.clearNotifications();
            }
            addTestResult('Bildirim Testi', 'Tüm bildirimler temizlendi', 'info');
        }

        // Form testleri
        function testFormSubmit() {
            const formData = {
                name: document.getElementById('testName').value,
                email: document.getElementById('testEmail').value,
                phone: document.getElementById('testPhone').value,
                category: document.getElementById('testCategory').value
            };

            if (!formData.name || !formData.email) {
                errorHandler.showError('Ad Soyad ve E-posta alanları zorunludur!');
                addTestResult('Form Testi', 'Form validasyon hatası', 'error');
                return;
            }

            errorHandler.showSuccess('Form başarıyla gönderildi!');
            addTestResult('Form Testi', 'Form başarıyla gönderildi', 'success');
        }

        function testFormErrors() {
            const nameField = document.getElementById('testName');
            const emailField = document.getElementById('testEmail');

            errorHandler.markFieldError(nameField, 'Ad Soyad alanı zorunludur');
            errorHandler.markFieldError(emailField, 'Geçerli bir e-posta adresi girin');

            addTestResult('Form Testi', 'Form hataları gösterildi', 'error');
        }

        function clearFormErrors() {
            const fields = ['testName', 'testEmail', 'testPhone', 'testCategory'];
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                errorHandler.clearFieldError(field);
            });
            addTestResult('Form Testi', 'Form hataları temizlendi', 'info');
        }

        function testFormValidation() {
            const nameField = document.getElementById('testName');
            const emailField = document.getElementById('testEmail');

            // Validasyon testleri
            if (!nameField.value.trim()) {
                errorHandler.markFieldError(nameField, 'Ad Soyad alanı zorunludur');
            }

            if (!emailField.value.trim()) {
                errorHandler.markFieldError(emailField, 'E-posta alanı zorunludur');
            } else if (!isValidEmail(emailField.value)) {
                errorHandler.markFieldError(emailField, 'Geçerli bir e-posta adresi girin');
            }

            addTestResult('Form Testi', 'Form validasyonu çalıştırıldı', 'info');
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Loading testleri
        function testLoadingOverlay() {
            errorHandler.showLoadingOverlay('Sayfa yükleniyor...');
            setTimeout(() => {
                errorHandler.hideLoadingOverlay();
                addTestResult('Loading Testi', 'Loading overlay test edildi', 'success');
            }, 3000);
        }

        function testButtonLoading() {
            const button = document.querySelector('.test-button');
            errorHandler.setButtonLoading(button, 'Yükleniyor...');
            setTimeout(() => {
                errorHandler.clearButtonLoading(button);
                addTestResult('Loading Testi', 'Button loading test edildi', 'success');
            }, 2000);
        }

        function testFormLoading() {
            const form = document.querySelector('.test-form');
            errorHandler.setFormLoading(form);
            setTimeout(() => {
                errorHandler.clearFormLoading(form);
                addTestResult('Loading Testi', 'Form loading test edildi', 'success');
            }, 2000);
        }

        function hideAllLoading() {
            errorHandler.hideLoadingOverlay();
            const buttons = document.querySelectorAll('.test-button');
            buttons.forEach(button => errorHandler.clearButtonLoading(button));
            const forms = document.querySelectorAll('.test-form');
            forms.forEach(form => errorHandler.clearFormLoading(form));
            addTestResult('Loading Testi', 'Tüm loading durumları durduruldu', 'info');
        }

        // API testleri
        async function testApiSuccess() {
            try {
                const response = await errorHandler.apiRequest('/api/test/success/');
                addTestResult('API Testi', 'Başarılı API çağrısı', 'success');
            } catch (error) {
                addTestResult('API Testi', 'API çağrısı başarısız', 'error');
            }
        }

        async function testApi401() {
            try {
                await errorHandler.apiRequest('/api/test/401/');
            } catch (error) {
                addTestResult('API Testi', '401 Unauthorized hatası yakalandı', 'error');
            }
        }

        async function testApi403() {
            try {
                await errorHandler.apiRequest('/api/test/403/');
            } catch (error) {
                addTestResult('API Testi', '403 Forbidden hatası yakalandı', 'error');
            }
        }

        async function testApi404() {
            try {
                await errorHandler.apiRequest('/api/test/404/');
            } catch (error) {
                addTestResult('API Testi', '404 Not Found hatası yakalandı', 'error');
            }
        }

        async function testApi500() {
            try {
                await errorHandler.apiRequest('/api/test/500/');
            } catch (error) {
                addTestResult('API Testi', '500 Server Error hatası yakalandı', 'error');
            }
        }

        async function testApiConnectionError() {
            try {
                await errorHandler.apiRequest('https://invalid-url-that-does-not-exist.com/');
            } catch (error) {
                addTestResult('API Testi', 'Bağlantı hatası yakalandı', 'error');
            }
        }

        // Global hata testleri
        function testJavaScriptError() {
            try {
                // Kasıtlı JavaScript hatası
                const undefinedVar = undefined;
                undefinedVar.someMethod();
            } catch (error) {
                addTestResult('Global Hata Testi', 'JavaScript hatası yakalandı', 'error');
            }
        }

        function testPromiseRejection() {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Test Promise Rejection')), 100);
            });

            promise.catch(error => {
                addTestResult('Global Hata Testi', 'Promise rejection yakalandı', 'error');
            });
        }

        function testTokenManagement() {
            // Token testleri
            localStorage.setItem('access_token', 'test-token');
            const token = localStorage.getItem('access_token');
            addTestResult('Token Testi', `Token yönetimi test edildi: ${token ? 'Token var' : 'Token yok'}`, 'info');
        }

        function testAuthCheck() {
            const token = localStorage.getItem('access_token');
            if (!token) {
                errorHandler.showWarning('Oturum bulunamadı, giriş sayfasına yönlendiriliyorsunuz');
                addTestResult('Auth Testi', 'Oturum kontrolü: Oturum yok', 'warning');
            } else {
                addTestResult('Auth Testi', 'Oturum kontrolü: Oturum var', 'success');
            }
        }

        // Test sonuçları yönetimi
        function addTestResult(category, message, type) {
            const timestamp = new Date().toLocaleTimeString('tr-TR');
            const result = `[${timestamp}] ${category}: ${message}`;
            testResults.push(result);

            const resultsElement = document.getElementById('testResults');
            resultsElement.textContent = testResults.join('\n');
            resultsElement.scrollTop = resultsElement.scrollHeight;

            // API sonuçları için ayrı alan
            if (category === 'API Testi') {
                const apiResultsElement = document.getElementById('apiResults');
                apiResultsElement.textContent = result;
            }
        }

        function clearTestResults() {
            testResults = [];
            document.getElementById('testResults').textContent = 'Test sonuçları temizlendi...';
            document.getElementById('apiResults').textContent = 'API test sonuçları burada görünecek...';
        }

        function exportTestResults() {
            const resultsText = testResults.join('\n');
            const blob = new Blob([resultsText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `test-results-${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            addTestResult('Export', 'Test sonuçları indirildi', 'success');
        }

        // Sayfa yüklendiğinde
        document.addEventListener('DOMContentLoaded', function() {
            addTestResult('Sistem', 'Test sayfası yüklendi', 'info');
        });