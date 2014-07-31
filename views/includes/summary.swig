{% block summary %}
    {% if summary %}
        {% block summary-content %}
            {{ summary|resolveLinks|markdown }}
        {% endblock %}
    {% endif %}
{% endblock %}
