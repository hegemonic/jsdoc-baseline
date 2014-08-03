{% import '../macros.swig' as macros %}

{% if properties && properties.length %}
    {% set props = moveChildren(properties) %}
    <h>{{ translate('headings.properties', props.length) }}</h>
    {{ macros.infoTable(props, { isEnum: props.isEnum }) }}
{% endif %}
