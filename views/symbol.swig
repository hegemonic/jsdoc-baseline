{% extends 'layout.swig' %}
{% import 'macros.swig' as macros %}

{% block banner %}{% endblock %}

{% block main-content %}
    {% block symbol-overview %}
        {% set context = {
            category: pageCategory,
            docs: docs,
            members: members
        } %}
        {% include 'symboloverview.swig' with context only %}
    {% endblock %}

    {% block symbol-content %}
        {% include 'includes/symbolcontent.swig' with context only %}
    {% endblock %}
{% endblock %}
