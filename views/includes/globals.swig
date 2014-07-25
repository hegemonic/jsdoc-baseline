{% extends 'symbol.swig' %}

{% block main-content %}
    <h {{ cssClass('page-title') }}>{{ pageTitle }}</h>
    <section>
        {% block symbol-members %}
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
