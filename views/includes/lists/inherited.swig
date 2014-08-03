{% import '../../macros.swig' as macros %}

{% if inherited && inherits %}
    <dt>{{ translate('headings.inheritedFrom') }}</dt>
    {{ macros.listItems(inherits, { needsLink: true }) }}
{% endif %}
