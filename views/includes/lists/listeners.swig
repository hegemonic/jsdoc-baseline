{% import '../../macros.swig' as macros %}

{% block listeners %}
    {% if listeners && listeners.length %}
        {% block listeners-content %}
            <dt>{{ translate('headings.listeners', listeners.length) }}</dt>
            {{ macros.listitems(listeners, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
