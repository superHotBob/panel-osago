// (function (m, e, t, r, i, k, a) {
//     m[i] = m[i] || function () {
//         (m[i].a = m[i].a || []).push(arguments)
//     };
//     m[i].l = 1 * new Date();
//     k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
// })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
//
// ym(52986040, "init", {clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true});

(() => {
    const gtmSrc = 'https://www.googletagmanager.com/gtag/js?id=G-LX3LJVRZY5'
    if (!document.querySelector('script[src="' + gtmSrc + '"]')) {
        const scriptEl = document.createElement('script')
        const firstScript = document.getElementsByTagName('script')[0]
        scriptEl.async = 1
        scriptEl.src = gtmSrc
        const insert = function () {
            firstScript.parentNode.insertBefore(scriptEl, firstScript)
        }
        if (window.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", insert, false);
        } else {
            insert();
        }
    }
    window.dataLayer = window.dataLayer || [];
    window.gtagMust = function () {
        dataLayer.push(arguments);
    }

    window.gtagMust('js', new Date());
    gtagMust('config', 'G-LX3LJVRZY5', {
        'send_page_view': false
    });


    function getYaCounterId() {
        if (window.Ya) {
            try {
                return Ya.Metrika.counters()[0].id;
            } catch (e) {
                try {
                    return Ya.Metrika2.counters()[0].id;
                } catch (e) {
                    return false;
                }
            }
        }

        return false
    }

    window.getYaCounterId = getYaCounterId
})()
