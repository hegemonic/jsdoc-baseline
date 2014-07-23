{% import '../../macros.swig' as macros %}

{% block todo %}
    {% if todo && todo.length %}
        {% block todo-content %}
            <dt>{{ translate('headings.todo') }}</dt>
            {{ macros.listitems(todo) }}
        {% endblock %}
    {% endif %}
{% endblock %}
