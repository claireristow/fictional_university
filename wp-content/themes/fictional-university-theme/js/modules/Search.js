import $ from 'jquery';

class Search {
    // 1. describe and create/initiate our object
    constructor() {
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.events();
        this.isOverlayOpen = false;
    }

    // 2. events (clicks, keyboard events, etc.)

    events() {
        // when search and close icons are clicked
        this.openButton.on('click', this.openOverlay.bind(this));
        this.closeButton.on('click', this.closeOverlay.bind(this));

        // when 2 and esc are clicked on the keyboard... 
        $(document).on('keydown', this.keyPressDispatcher.bind(this));
    }

    // 3. methods (function, action...)

    keyPressDispatcher(e) {

        // if "s" is clicked... 
        if (e.keyCode == 83 && !this.isOverlayOpen) {
            this.openOverlay();
        };

        // if "esc" is clicked... 
        if (e.keyCode == 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    openOverlay() {
        this.searchOverlay.addClass('search-overlay--active');
        $('body').addClass('body-no-scroll');
        console.log("open fired");
        this.isOverlayOpen = true;
    }

    closeOverlay() {
        this.searchOverlay.removeClass('search-overlay--active');
        $('body').removeClass('body-no-scroll');
        console.log('close fired');
        this.isOverlayOpen = false;
    }

}

export default Search;