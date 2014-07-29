{% import '../macros.swig' as macros %}

{% block properties %}
    {% if properties && properties.length %}
        {% set props = moveChildren(properties) %}
        {% block properties-content %}
            <h>{{ translate('headings.properties', props.length) }}</h>
            {{ macros.infotable(props, { isEnum: props.isEnum }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
