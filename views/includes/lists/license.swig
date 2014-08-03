{% import '../../macros.swig' as macros %}

{% if license %}
    <dt>{{ translate('headings.license') }}</dt>
    {{ macros.listItems(license) }}
{% endif %}
