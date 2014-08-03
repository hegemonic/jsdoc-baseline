{% extends 'layout.swig' %}
{% import 'macros.swig' as macros %}

{% block banner %}{% endblock %}

{% block main-content %}
    {% for doc in docs %}
        <section>
            {{ resetHeadingLevel() }}
            {% include 'includes/symbolheader.swig' %}

            {%- block symbol-members -%}
                {# Summary lists of all members #}
                {% block symbol-summary %}
                    {% set context = { members: members } %}
                    {% include 'includes/components/summaryblocks.swig' with context %}
                {% endblock %}

                {#
                    The entry point to the symbol documented here. Can be one of:
                    1. A class
                    2. The only symbol exported by a module (which might be a class)

                #}
                {%- block symbol-entrypoint %}
                    <section id="entrypoint">
                        {#
                            If a module exports only one symbol, document the symbol here, since
                            it's not a member of anything else.
                        #}
                        {% if doc.kind === 'module' && doc.exports %}
                            {% for moduleExports in doc.exports %}
                                {% set context = { doc: moduleExports } %}
                                {% include 'symbol-detail.swig' with context %}
                            {% endfor %}
                        {# Classes also need additional docs, beyond what's in the header. #}
                        {% elif doc.kind === 'class' %}
                            {% set context = { doc: doc } %}
                            {% include 'symbol-detail.swig' with context %}
                        {% endif %}
                    </section>
                {% endblock %}

                {% block symbol-classes %}
                    {% set context = {
                        symbolItems: members[CATEGORIES.CLASSES],
                        headingKey: CATEGORIES.CLASSES
                    } %}
                    {% include 'includes/members-links.swig' with context %}
                {% endblock %}

                {% block symbol-namespaces %}
                    {% set context = {
                        symbolItems: members[CATEGORIES.NAMESPACES],
                        headingKey: CATEGORIES.NAMESPACES
                    } %}
                    {% include 'includes/members-links.swig' with context %}
                {% endblock %}

                {% block symbol-properties %}
                    {% set context = {
                        symbolItems: members[CATEGORIES.PROPERTIES],
                        headingKey: CATEGORIES.PROPERTIES
                    } %}
                    {% include 'includes/members-detail.swig' with context %}
                {% endblock %}

                {% block symbol-methods %}
                    {% set context = {
                        symbolItems: members[CATEGORIES.FUNCTIONS],
                        headingKey: CATEGORIES.FUNCTIONS
                    } %}
                    {% include 'includes/members-detail.swig' with context %}
                {% endblock %}

                {% block symbol-typedefs %}
                    {% set context = {
                        symbolItems: members[CATEGORIES.TYPEDEFS],
                        headingKey: CATEGORIES.TYPEDEFS
                    } %}
                    {% include 'includes/members-detail.swig' with context %}
                {% endblock %}

                {% block symbol-events %}
                    {% set context = {
                        symbolItems: members[CATEGORIES.EVENTS],
                        headingKey: CATEGORIES.EVENTS
                    } %}
                    {% include 'includes/members-detail.swig' with context %}
                {% endblock %}
            {% endblock %}
        </section>
    {% endfor %}
{% endblock %}
