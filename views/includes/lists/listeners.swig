{% import '../../macros.swig' as macros %}

{% block listeners %}
    {% if listeners && listeners.length %}
        {% block listeners-content %}
            {{ macros.minilist(listeners, 'listeners', 'Listeners of This Event',
            	{ needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
