{% import '../../macros.swig' as macros %}

{% if fires && fires.length %}
    <dt>{{ translate('headings.fires') }}</dt>
    {{ macros.listItems(fires, { needsLink: true }) }}
{% endif %}
