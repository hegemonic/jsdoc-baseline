{% import '../../macros.swig' as macros %}

{% block fires %}
    {% if fires && fires.length %}
        {% block fires-content %}
            {{ macros.minilist(fires, 'fires', 'Fires', true) }}
        {% endblock %}
    {% endif %}
{% endblock %}
