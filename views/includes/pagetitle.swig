{% if pageCategory %}
    {{ translate('pageTitle', {
        category: translate('headings.' + pageCategory),
        title: pageTitle
    }) }}
{% else %}
    {{ pageTitle }}
{% endif %}
