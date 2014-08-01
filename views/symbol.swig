{% extends 'layout.swig' %}
{% import 'macros.swig' as macros %}

{% block banner %}{% endblock %}

{% block main-content %}
    {% for doc in docs %}
        <section>
            {% resetheadinglevel -%}
            {%- block symbol-header -%}
                <header {{ cssClass('!page-header') }}>
                    {%- block symbol-header-heading -%}
                        {%- spaceless %}
                            <h>
                                {% block symbol-header-ancestors %}
                                    {% if doc.ancestors && doc.ancestors.length %}
                                        {# TODO: make <small> tag configurable #}
                                        <small {{ cssClass('symbol-ancestors') }}>
                                            {{ ancestorLinks(doc) }}
                                        </small>
                                    {% endif %}
                                {% endblock %}
                                {% block symbol-header-name %}
                                    {{ doc.name }}
                                {% endblock %}
                                {% block symbol-header-variation %}
                                    {# By default, the variation is not displayed. #}
                                {% endblock %}
                            </h>
                        {% endspaceless -%}
                    {%- endblock -%}

                    {%- block symbol-header-classdesc -%}
                        {%- if doc.classdesc %}
                            <div {{ cssClass('!symbol-classdesc') }}>
                                {{ doc.classdesc|resolveLinks|markdown }}
                            </div>
                        {% endif -%}
                    {%- endblock -%}

                    {%- block symbol-header-description -%}
                        {% if doc.kind !== 'class' %}
                            <div {{ cssClass('!symbol-description') }}>
                                {% include 'includes/description.swig' with doc %}
                            </div>
                        {% endif %}
                    {%- endblock -%}

                    {%- block symbol-header-meta -%}
                        <dl {{ cssClass('!dl-compact') }}>
                            {%- block symbol-header-source -%}
                                {% include 'includes/sourcefile.swig' with doc %}
                            {%- endblock -%}
                        </dl>
                    {%- endblock -%}
                </header>
            {%- endblock -%}

            {%- block symbol-members -%}
                {% set symbolClasses = members[CATEGORIES.CLASSES] %}
                {% set symbolNamespaces = members[CATEGORIES.NAMESPACES] %}
                {% set symbolProperties = members[CATEGORIES.PROPERTIES] %}
                {% set symbolMethods = members[CATEGORIES.FUNCTIONS] %}
                {% set symbolTypedefs = members[CATEGORIES.TYPEDEFS] %}
                {% set symbolEvents = members[CATEGORIES.EVENTS] %}

                {# Summary lists of all members #}
                {% block symbol-summary %}
                    {% include 'includes/components/summary-blocks.swig' %}
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
                        symbolItems: symbolClasses,
                        headingKey: CATEGORIES.CLASSES
                    } %}
                    {% include 'includes/members-links.swig' with context %}
                {% endblock %}

                {% block symbol-namespaces %}
                    {% set context = {
                        symbolItems: symbolNamespaces,
                        headingKey: CATEGORIES.NAMESPACES
                    } %}
                    {% include 'includes/members-links.swig' with context %}
                {% endblock %}

                {% block symbol-properties %}
                    {% set context = {
                        symbolItems: symbolProperties,
                        headingKey: CATEGORIES.PROPERTIES
                    } %}
                    {% include 'includes/members-detail.swig' with context %}
                {% endblock %}

                {% block symbol-methods %}
                    {% set context = {
                        symbolItems: symbolMethods,
                        headingKey: CATEGORIES.FUNCTIONS
                    } %}
                    {% include 'includes/members-detail.swig' with context %}
                {% endblock %}

                {% block symbol-typedefs %}
                    {% set context = {
                        symbolItems: symbolTypedefs,
                        headingKey: CATEGORIES.TYPEDEFS
                    } %}
                    {% include 'includes/members-detail.swig' with context %}
                {% endblock %}

                {% block symbol-events %}
                    {% set context = {
                        symbolItems: symbolEvents,
                        headingKey: CATEGORIES.EVENTS
                    } %}
                    {% include 'includes/members-detail.swig' with context %}
                {% endblock %}
            {% endblock %}
        </section>
    {% endfor %}
{% endblock %}
