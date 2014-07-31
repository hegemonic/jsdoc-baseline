{% block description %}
    {% if description %}
        {% block description-content %}
            {{ description|resolveLinks|markdown }}
        {% endblock %}
    {% endif %}
{% endblock %}
