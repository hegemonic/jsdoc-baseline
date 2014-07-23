{% import '../../macros.swig' as macros %}

{% block defaultvalue %}
    {% if defaultvalue %}
        {% block defaultvalue-content %}
            {# TODO: incorporate changes from https://github.com/jsdoc3/jsdoc/commit/70109a29 and
                https://github.com/jsdoc3/jsdoc/commit/9af5ea42 #}
            <dt>{{ translate('headings.defaultValue') }}</dt>
            {{ macros.listitems(defaultvalue) }}
        {% endblock %}
    {% endif %}
{% endblock %}
