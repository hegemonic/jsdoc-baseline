{% import '../../macros.swig' as macros %}

{% block see %}
    {% if see && see.length %}
        {% block see-content %}
            {{ macros.minilist(see, 'see', 'See', true) }}
        {% endblock %}
    {% endif %}
{% endblock %}
