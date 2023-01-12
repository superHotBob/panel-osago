export function getYandexShareParams(url) {
    return {
        content: {
            url,
        },

        theme: {
            services: 'facebook,whatsapp,telegram,odnoklassniki,viber,vkontakte',
            direction: 'vertical',
        },
    }
}

