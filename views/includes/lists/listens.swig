{% import '../../macros.swig' as macros %}

{% if listens && listens.length %}
    <dt>{{ translate('headings.listens') }}</dt>
    {{ macros.listItems(listens, { needsLink: true }) }}
{% endif %}
