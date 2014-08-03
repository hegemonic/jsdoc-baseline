{% import '../../macros.swig' as macros %}

{% if copyright %}
    <dt>{{ translate('headings.copyright') }}</dt>
    {{ macros.listItems(copyright) }}
{% endif %}
