{% import '../../macros.swig' as macros %}

{% block todo %}
    {% if todo && todo.length %}
        {% block todo-content %}
            <dt>To do</dt>
            {{ macros.listitems(todo) }}
        {% endblock %}
    {% endif %}
{% endblock %}
