{# TODO: get rid of this, or move to lists #}
{% block sourcefile %}
    {% if config('outputSourceFiles') && doc.meta && doc.meta.filename && doc.meta.lineno %}
        {% block sourcefile-content %}
            {# or "inherited from" or "mixed in from"? #}
            <dt>{{ translate('headings.definedIn') }}</dt>
            <dd>{% include 'sourcelink.swig' with doc %}</dd>
        {% endblock %}
    {% endif %}
{% endblock %}
