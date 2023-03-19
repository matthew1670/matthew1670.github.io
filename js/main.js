/** @format */

const swiper = new Swiper(".swiper", {
    // Optional parameters
    loop: true,
    slidesPerView: 2,
    spaceBetween: 20,
    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    // And if we need scrollbar
    scrollbar: {
        el: ".swiper-scrollbar",
        enabled: false,
    },
    breakpoints: {
        // when window width is >= 480px
        480: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        // when window width is >= 640px
        640: {
            slidesPerView: 4,
            spaceBetween: 40,
            pagination: {
                el: ".swiper-pagination",
            },
        },
    },
});
