{% import '../../macros.swig' as macros %}

{% if requires && requires.length %}
    <dt>{{ translate('headings.requires') }}</dt>
    {{ macros.listItems(requires, { needsLink: true }) }}
{% endif %}
