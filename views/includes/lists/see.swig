{% import '../../macros.swig' as macros %}

{% if see && see.length %}
    <dt>{{ translate('headings.see') }}</dt>
    {{ macros.listItems(see, { needsLink: true }) }}
{% endif %}
