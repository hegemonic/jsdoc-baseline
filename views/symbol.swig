{% extends 'layout.swig' %}
{% import 'macros.swig' as macros %}

{% block banner %}{% endblock %}

{% block main-content %}
    {% block symbol-overview %}
        {% set context = { docs: docs } %}
        {% include 'symboloverview.swig' with context only %}
    {% endblock %}

    {% block symbol-content %}
        <section>
            {% block symbol-classes %}
                {% set context = {
                    symbolItems: members[CATEGORIES.CLASSES],
                    headingKey: CATEGORIES.CLASSES
                } %}
                {% include 'includes/members-links.swig' with context only %}
            {% endblock %}

            {% block symbol-namespaces %}
                {% set context = {
                    symbolItems: members[CATEGORIES.NAMESPACES],
                    headingKey: CATEGORIES.NAMESPACES
                } %}
                {% include 'includes/members-links.swig' with context only %}
            {% endblock %}

            {% block symbol-properties %}
                {% set context = {
                    symbolItems: members[CATEGORIES.PROPERTIES],
                    headingKey: CATEGORIES.PROPERTIES
                } %}
                {% include 'includes/members-detail.swig' with context only %}
            {% endblock %}

            {% block symbol-methods %}
                {% set context = {
                    symbolItems: members[CATEGORIES.FUNCTIONS],
                    headingKey: CATEGORIES.FUNCTIONS
                } %}
                {% include 'includes/members-detail.swig' with context only %}
            {% endblock %}

            {% block symbol-typedefs %}
                {% set context = {
                    symbolItems: members[CATEGORIES.TYPEDEFS],
                    headingKey: CATEGORIES.TYPEDEFS
                } %}
                {% include 'includes/members-detail.swig' with context only %}
            {% endblock %}

            {% block symbol-events %}
                {% set context = {
                    symbolItems: members[CATEGORIES.EVENTS],
                    headingKey: CATEGORIES.EVENTS
                } %}
                {% include 'includes/members-detail.swig' with context only %}
            {% endblock %}
        </section>
    {% endblock %}
{% endblock %}
