{% block summary %}
    {% if summary %}
        {% block summary-content %}
            {{ summary|markdown }}
        {% endblock %}
    {% endif %}
{% endblock %}
