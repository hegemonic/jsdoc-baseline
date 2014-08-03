{% import '../../macros.swig' as macros %}

{% if augments && augments.length %}
    <dt>{{ translate('headings.augments') }}</dt>
    {{ macros.listItems(augments, { needsLink: true }) }}
{% endif %}
