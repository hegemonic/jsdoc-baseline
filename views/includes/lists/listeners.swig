{% import '../../macros.swig' as macros %}

{% if listeners && listeners.length %}
    <dt>{{ translate('headings.listeners', listeners.length) }}</dt>
    {{ macros.listItems(listeners, { needsLink: true }) }}
{% endif %}
