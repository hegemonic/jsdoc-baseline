{% block description %}
    {% if description %}
        {% block description-content %}
            {{ description|markdown }}
        {% endblock %}
    {% endif %}
{% endblock %}
