{% import '../../macros.swig' as macros %}

{% block listeners %}
    {% if listeners && listeners.length %}
        {% block listeners-content %}
            <dt>Listeners</dt>
            {{ macros.listitems(listeners, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
