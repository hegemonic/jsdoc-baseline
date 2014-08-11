{% import '../../macros.swig' as macros %}

{% if implements && implements.length %}
    <dt>{{ translate('headings.implements', implements.length) }}</dt>
    {{ macros.listItems(implements, { needsLink: true }) }}
{% endif %}
