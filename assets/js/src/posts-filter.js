function render_ajax_query(data, target_id, uri) {
    var $el = jQuery(`[data-query-id="${target_id}"]`);
    $el.html("");
    jQuery.ajax({
        url: uri,
        method: "GET",
        data: data,
        dataType: "JSON",
        success: function(resp) {
            $el.html(jQuery(resp.data));
        }
    });
}

function build_query_parameters($el, display, type) {
    var _month = "";
    var _year = "";
    if (type === "archive") {
        const archive_url = (display === "option") ? $el.val() : $el.attr("href");
        if (archive_url.split("?")[1]) {
            const urlParams = new window.URLSearchParams(archive_url.split("?")[1]);
            _month = (urlParams.get("_month")) ? urlParams.get("_month").replace(/\D/g, "") : "";
            _year = urlParams.get("_year").replace(/\D/g, "");
        }
    }

    var termid = "";
    if (type === "category") {
        termid = (display === "option") ? $el.val() : $el.data("termid");
    }

    const data = {
        term_id: termid,
        taxonomy: $el.closest("div").data("taxonomy"),
        month: _month,
        _year: _year,
        action: "filter_posts_widget"
    };

    return data;
}

function prepare_ajax_query($el, display, type) {
    const data = build_query_parameters($el, display, type);
    const URI = window.location.href.split('?')[0];
    if ($el.closest(".elementor-element").hasClass("posts-filter--ajax-yes")) {
        data.is_ajax = 1;
        var target_id =  $el.closest("div").data("targetid");
        render_ajax_query(data, target_id, URI);
    }else{
        const params = jQuery.param(data);
        window.location.href = URI + "?" + params;
    }
}

jQuery(window).on("elementor/frontend/init", function() {
    jQuery(".posts-filter--type-archive a").click(function(e) {
        e.preventDefault();
        prepare_ajax_query(jQuery(this), "html", "archive");
    });

    jQuery(".posts-filter--type-archive select").change(function(e) {
        e.preventDefault();
        prepare_ajax_query(jQuery(this), "option", "archive");
    });

    jQuery(".posts-filter--type-category a").click(function(e) {
        e.preventDefault();
        prepare_ajax_query(jQuery(this), "html", "category");
    });

    jQuery(".posts-filter--type-category select").change(function(e) {
        e.preventDefault();
        prepare_ajax_query(jQuery(this), "option", "category");
    });
});