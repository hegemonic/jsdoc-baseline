{% import '../../macros.swig' as macros %}

{% block todo %}
    {% if todo && todo.length %}
        {% block todo-content %}
            {{ macros.minilist(todo, 'todo', 'To Do') }}
        {% endblock %}
    {% endif %}
{% endblock %}
