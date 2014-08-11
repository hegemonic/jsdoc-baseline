{% import '../../macros.swig' as macros %}

{% if implementations && implementations.length %}
    <dt>{{ translate('headings.implementations', implementations.length) }}</dt>
    {{ macros.listItems(implementations, { needsLink: true }) }}
{% endif %}
