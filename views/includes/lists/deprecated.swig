{% import '../../macros.swig' as macros %}

{% if deprecated %}
    <dt>{{ translate('headings.deprecated') }}</dt>
    {{ macros.listItems(deprecated) }}
{% endif %}
