import $ from 'jquery';

class Search {
    // 1. describe and create/initiate our object
    constructor() {
        this.resultsDiv = $('#search-overlay__results');
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $('#search-term');
        this.events();
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.previousValue;
        this.typingTimer;
    }

    // 2. events (clicks, keyboard events, etc.)

    events() {

        // when search and close icons are clicked
        this.openButton.on('click', this.openOverlay.bind(this));
        this.closeButton.on('click', this.closeOverlay.bind(this));

        // when 2 and esc are clicked on the keyboard... 
        $(document).on('keydown', this.keyPressDispatcher.bind(this));

        // when a key is clicked in the searchbar... 
        this.searchField.on('keyup', this.typingLogic.bind(this));

    }

    // 3. methods (function, action...)

    typingLogic() {

        // if the keystroke doesn't change the search field (eg. arrow keys)
        if (this.searchField.val() != this.previousValue) {
            clearTimeout(this.typingTimer);

            if (this.searchField.val()) {

                // search field is not blank, so show the spinner
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 2000);

            } else {

                // search field is empty, so empty the results div
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;

            }

            
        }

        this.previousValue = this.searchField.val();
    }

    getResults() {
        console.log('getResults fired')
        $.getJSON('http://fictional-university.local/wp-json/wp/v2/posts?search=' + this.searchField.val(), function(posts) {
            alert(posts[0].title.rendered);
        });
    }

    keyPressDispatcher(e) {

        // if "s" is pressed... 
        if (e.keyCode == 83 && !this.isOverlayOpen && !$('input', 'textarea').is(':focus')) {
            this.openOverlay();
        };

        // if "esc" is pressed... 
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