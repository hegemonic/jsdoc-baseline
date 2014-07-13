{# TODO: get rid of this, or move to lists #}
{% block sourcefile %}
    {% if doc.meta && doc.meta.filename && doc.meta.lineno %}
        {% block sourcefile-content %}
            {# or "inherited from" or "mixed in from"? #}
            <dt>Defined in</dt>
            <dd>{% include 'sourcelink.swig' with doc %}</dd>
        {% endblock %}
    {% endif %}
{% endblock %}
