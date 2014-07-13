{% import '../../macros.swig' as macros %}

{% block listens %}
    {% if listens && listens.length %}
        {% block listens-content %}
            {{ macros.minilist(listens, 'listens', 'Listens to Events', true) }}
        {% endblock %}
    {% endif %}
{% endblock %}
