export const MANUAL_CONTENT = {
    ua: `
        <div class="space-y-6 text-gray-800">
            <h1 class="text-3xl font-bold text-indigo-700 border-b pb-2">📊 Інструкція користувача: Client Analytics v18.0</h1>

            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                <h2 class="text-lg font-bold text-red-700 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    🔒 БЕЗПЕКА — ВАШІ ДАНІ НІКУДИ НЕ ЗАВАНТАЖУЮТЬСЯ
                </h2>
                <div class="mt-2 text-sm text-red-800">
                    <p class="font-bold">Цей інструмент працює на 100% у вашому браузері. Жодні дані, файли чи інформація про клієнтів ніколи не передаються на жодний сервер або третім особам.</p>
                    <p class="mt-1">Кожне обчислення, кожен графік, кожна таблиця — все відбувається локально на вашому комп'ютері.</p>
                    <p class="mt-1">Інструментом можна користуватися повністю в офлайн-режимі (крім отримання актуального курсу валют, який є необов'язковим).</p>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 text-sm bg-gray-100 p-3 rounded-lg">
                <span><strong>Підтримувані файли:</strong> .csv · .xlsx · .xls</span>
                <span><strong>Мови інтерфейсу:</strong> 🇺🇦 Українська · 🇬🇧 English</span>
            </div>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">🚀 1. Початок роботи</h2>
                <ol class="list-decimal list-inside space-y-2 ml-2">
                    <li>Відкрийте посилання на інструмент у браузері.</li>
                    <li>Натисніть кнопку <strong class="text-indigo-600">"Завантажити файл"</strong> та оберіть ваш файл-вивантаження (.csv, .xlsx або .xls).</li>
                    <li>З'явиться екран завантаження <strong>"Обробка даних…"</strong> — інструмент автоматично визначає структуру файлу, конвертує валюти в євро (€) та запускає аналіз.</li>
                    <li>Повна інформаційна панель з'являється автоматично.</li>
                </ol>
                <div class="mt-3 bg-blue-50 p-3 rounded border border-blue-100 text-sm text-blue-800">
                    <strong>Мова інтерфейсу:</strong> Перемикайте між українською та англійською у будь-який момент за допомогою тумблера <strong>UA / EN</strong> у правому верхньому куті.
                </div>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">📱 2. Встановлення застосунку (PWA)</h2>
                <p class="mb-2">Ви можете встановити цей інструмент як нативну програму на ваш комп'ютер або телефон для роботи офлайн.</p>
                <ul class="list-disc list-inside space-y-1 ml-2 text-sm">
                    <li><strong>Комп'ютер (Chrome/Edge):</strong> Натисніть піктограму встановлення (монітор зі стрілкою вниз) у правій частині адресного рядка.</li>
                    <li><strong>Мобільний (iOS):</strong> Натисніть "Поділитися" → "На початковий екран".</li>
                    <li><strong>Мобільний (Android):</strong> Натисніть меню (три крапки) → "Встановити додаток".</li>
                </ul>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">🔧 3. Майстер налаштування колонок</h2>
                <p class="mb-2">Якщо автоматичне визначення не знайде важливі колонки, з'явиться вікно <strong>"Налаштування колонок"</strong>.</p>
                <ol class="list-decimal list-inside space-y-1 ml-2 text-sm">
                    <li>Вікно покаже список обов'язкових полів (Ім'я, Дохід, Країна).</li>
                    <li>Виберіть відповідну колонку з вашого файлу для кожного поля.</li>
                    <li>Натисніть <strong>Підтвердити</strong>.</li>
                </ol>
                <p class="mt-2 text-sm text-gray-500">Викликати майстер вручну можна через піктограму ⚙️ (шестерня) у шапці.</p>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">⚙️ 4. Глобальні фільтри</h2>
                <p class="mb-2">Панель налаштувань дозволяє фільтрувати дані за країнами:</p>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm border bg-white">
                        <thead class="bg-gray-50 font-bold">
                            <tr><th class="p-2 border">Фільтр</th><th class="p-2 border">Що робить</th></tr>
                        </thead>
                        <tbody>
                            <tr><td class="p-2 border">📤 Країни відправлення</td><td class="p-2 border">Показує лише відправлення з обраних країн (напр. LT)</td></tr>
                            <tr><td class="p-2 border">📥 Країни отримання</td><td class="p-2 border">Показує лише відправлення до обраних країн (напр. DE, PL)</td></tr>
                        </tbody>
                    </table>
                </div>
                <p class="mt-2 text-xs italic text-gray-500">Дані перераховуються миттєво при зміні фільтрів.</p>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">💰 5. Валюта та курси</h2>
                <p class="mb-2">Всі суми конвертуються в <strong>Євро (€)</strong>.</p>
                <ul class="list-disc list-inside space-y-1 ml-2 text-sm">
                    <li>🟢 <strong>Live:</strong> Актуальний курс з інтернету.</li>
                    <li>🟡 <strong>Fixed:</strong> Офлайн режим, фіксовані середні курси.</li>
                </ul>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">🏆 6. ABC Аналіз (VIP)</h2>
                <p class="mb-2">Клієнти поділені на класи за внеском у дохід (Принцип Парето):</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-sm mb-2">
                    <div class="p-2 bg-yellow-100 border border-yellow-300 rounded">
                        <strong>🟡 A (VIP)</strong><br>Топ 80% доходу
                    </div>
                    <div class="p-2 bg-gray-100 border border-gray-300 rounded">
                        <strong>⚪ B</strong><br>Наступні 15%
                    </div>
                    <div class="p-2 bg-orange-100 border border-orange-300 rounded">
                        <strong>🟠 C</strong><br>Останні 5%
                    </div>
                </div>
                <p class="text-sm">Клікніть на картку ABC на дашборді, щоб відфільтрувати таблицю.</p>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">📊 7. Графіки та Аналітика</h2>
                <p class="mb-2">16 інтерактивних графіків за категоріями: Країни, Клієнти, Канали, Вага, Маршрути.</p>
                <ul class="list-disc list-inside space-y-1 ml-2 text-sm">
                    <li>Наведіть курсор для деталей.</li>
                    <li>Клікніть на країну або клієнта на графіку, щоб знайти їх у таблиці.</li>
                </ul>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">📋 8. Таблиця та Картка Клієнта</h2>
                <p class="mb-2">Таблиця містить всіх клієнтів після фільтрації.</p>
                <ul class="list-disc list-inside space-y-1 ml-2 text-sm">
                    <li>Сортуйте кліком по заголовку.</li>
                    <li>Шукайте за назвою через поле пошуку.</li>
                    <li>Клікніть на рядок, щоб відкрити <strong>детальну картку клієнта</strong> з повною інформацією (телефон, топ міст, географія).</li>
                </ul>
            </section>

            <hr class="border-gray-300 my-6">
            <p class="text-center text-gray-500 text-xs">Developed by Roman Novobranets © 2026</p>
        </div>
    `,
    en: `
        <div class="space-y-6 text-gray-800">
            <h1 class="text-3xl font-bold text-indigo-700 border-b pb-2">📊 User Manual: Client Analytics v18.0</h1>

            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                <h2 class="text-lg font-bold text-red-700 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    SECURITY — YOUR DATA NEVER LEAVES YOUR COMPUTER
                </h2>
                <div class="mt-2 text-sm text-red-800">
                    <p class="font-bold">This tool operates 100% inside your browser. No data, no files, no client information is ever sent to any server or third party.</p>
                    <p class="mt-1">Every calculation, every chart, every table — it all happens locally on your machine.</p>
                    <p class="mt-1">You can use it completely offline (except for the optional live currency rate fetch).</p>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 text-sm bg-gray-100 p-3 rounded-lg">
                <span><strong>Compatible files:</strong> .csv · .xlsx · .xls</span>
                <span><strong>Languages:</strong> 🇺🇦 Ukrainian · 🇬🇧 English</span>
            </div>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">🚀 1. Getting Started</h2>
                <ol class="list-decimal list-inside space-y-2 ml-2">
                    <li>Open the tool link in your browser.</li>
                    <li>Click <strong class="text-indigo-600">"Upload File"</strong> and select your export file.</li>
                    <li>A <strong>"Processing Data…"</strong> screen appears — the tool auto-detects columns, converts currencies to Euro (€), and runs analysis.</li>
                    <li>The full dashboard appears automatically.</li>
                </ol>
                <div class="mt-3 bg-blue-50 p-3 rounded border border-blue-100 text-sm text-blue-800">
                    <strong>Language:</strong> Switch between Ukrainian and English at any time using the <strong>UA / EN</strong> toggle in the top-right corner.
                </div>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">📱 2. Installing the App (PWA)</h2>
                <p class="mb-2">Install this tool as a native application for offline use.</p>
                <ul class="list-disc list-inside space-y-1 ml-2 text-sm">
                    <li><strong>Desktop (Chrome/Edge):</strong> Click the install icon in the address bar.</li>
                    <li><strong>Mobile (iOS):</strong> Tap "Share" → "Add to Home Screen".</li>
                    <li><strong>Mobile (Android):</strong> Tap the menu → "Install App".</li>
                </ul>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">🔧 3. Column Mapping Wizard</h2>
                <p class="mb-2">If auto-detection fails, the <strong>"Column Mapping"</strong> window appears.</p>
                <ol class="list-decimal list-inside space-y-1 ml-2 text-sm">
                    <li>Select the corresponding column from your file for each required field.</li>
                    <li>Click <strong>Confirm</strong>.</li>
                </ol>
                <p class="mt-2 text-sm text-gray-500">Access manually via the ⚙️ (gear) icon in the header.</p>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">⚙️ 4. Global Filters</h2>
                <p class="mb-2">Filter data by origin and destination countries:</p>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm border bg-white">
                        <thead class="bg-gray-50 font-bold">
                            <tr><th class="p-2 border">Filter</th><th class="p-2 border">Action</th></tr>
                        </thead>
                        <tbody>
                            <tr><td class="p-2 border">📤 Origin Countries</td><td class="p-2 border">Show shipments FROM selected countries</td></tr>
                            <tr><td class="p-2 border">📥 Destination Countries</td><td class="p-2 border">Show shipments TO selected countries</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">💰 5. Currency & Rates</h2>
                <p class="mb-2">All values are normalised to <strong>Euro (€)</strong>.</p>
                <ul class="list-disc list-inside space-y-1 ml-2 text-sm">
                    <li>🟢 <strong>Live:</strong> Today's exchange rates fetched from internet.</li>
                    <li>🟡 <strong>Fixed:</strong> Offline mode, using stable average rates.</li>
                </ul>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">🏆 6. ABC Analysis (VIP)</h2>
                <p class="mb-2">Pareto principle segmentation:</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-sm mb-2">
                    <div class="p-2 bg-yellow-100 border border-yellow-300 rounded">
                        <strong>🟡 A (VIP)</strong><br>Top 80% Revenue
                    </div>
                    <div class="p-2 bg-gray-100 border border-gray-300 rounded">
                        <strong>⚪ B</strong><br>Next 15%
                    </div>
                    <div class="p-2 bg-orange-100 border border-orange-300 rounded">
                        <strong>🟠 C</strong><br>Remaining 5%
                    </div>
                </div>
                <p class="text-sm">Click an ABC card to filter the client table.</p>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">📊 7. Charts & Analytics</h2>
                <p class="mb-2">16 interactive charts covering Countries, Clients, Channels, Weight, and Routes.</p>
                <ul class="list-disc list-inside space-y-1 ml-2 text-sm">
                    <li>Hover for details.</li>
                    <li>Click bars to filter the table or find clients.</li>
                </ul>
            </section>

            <section>
                <h2 class="text-2xl font-bold text-gray-700 mb-3">📋 8. Client Table & Card</h2>
                <p class="mb-2">Detailed list of all clients in the filtered view.</p>
                <ul class="list-disc list-inside space-y-1 ml-2 text-sm">
                    <li>Sort by clicking headers.</li>
                    <li>Search by name.</li>
                    <li>Click any row to open the <strong>Client Details Card</strong> (Phone, Top Cities, Geography, etc.).</li>
                </ul>
            </section>

            <hr class="border-gray-300 my-6">
            <p class="text-center text-gray-500 text-xs">Developed by Roman Novobranets © 2026</p>
        </div>
    `
};
