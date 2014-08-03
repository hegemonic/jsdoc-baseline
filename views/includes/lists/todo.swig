{% import '../../macros.swig' as macros %}

{% if todo && todo.length %}
    <dt>{{ translate('headings.todo') }}</dt>
    {{ macros.listItems(todo) }}
{% endif %}
