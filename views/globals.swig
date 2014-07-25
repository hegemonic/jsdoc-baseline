{% extends 'symbol.swig' %}

{% block main-content %}
    <h {{ cssClass('page-title') }}>{{ translate('headings.globals') }}</h>
    <section>
        {% block symbol-properties %}
            {% parent %}
        {% endblock %}

        {% block symbol-methods %}
            {% parent %}
        {% endblock %}

        {% block symbol-typedefs %}
            {% parent %}
        {% endblock %}

        {% block symbol-events %}
            {% parent %}
        {% endblock %}
    </section>
{% endblock %}
