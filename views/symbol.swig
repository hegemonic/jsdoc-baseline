{% extends 'layout.swig' %}
{% import 'macros.swig' as macros %}

{% block banner %}{% endblock %}

{% block main-content %}
    {% for doc in docs %}
        <section>
            {% resetheadinglevel -%}
            {%- block symbol-header -%}
                <header class="page-header">
                    {%- spaceless %}
                        <h>
                            {% block symbol-header-ancestors %}
                                {% if doc.ancestors && doc.ancestors.length %}
                                    {# TODO: make <small> tag configurable #}
                                    <small {{ cssclass('symbol-ancestors') }}>
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

                    {%- block symbol-header-classdesc -%}
                        {%- if doc.classdesc %}
                            <div {{ cssclass('!symbol-classdesc') }}>
                                {{ doc.classdesc|markdown }}
                            </div>
                        {% endif -%}
                    {%- endblock -%}

                    {%- block symbol-header-description -%}
                        {% if doc.kind !== 'class' %}
                            <div {{ cssclass('!symbol-description') }}>
                                {% include 'includes/description.swig' with doc %}
                            </div>
                        {% endif %}
                    {%- endblock -%}

                    {%- block symbol-header-meta -%}
                        <dl {{ cssclass('!dl-compact') }}>
                            {%- block symbol-header-source -%}
                                {% include 'includes/sourcefile.swig' with doc %}
                            {%- endblock -%}
                        </dl>
                    {%- endblock -%}
                </header>
            {%- endblock -%}

            {%- block symbol -%}
                {%- block symbol-overview %}
                    <section id="overview">
                        {#
                            If a module exports only one symbol (such as a constructor), use that
                            symbol as the context
                        #}
                        {% if doc.kind === 'module' && doc.exports %}
                            {% for moduleExports in doc.exports %}
                                {% set context = { doc: moduleExports } %}
                                {% if moduleExports.kind === 'class' %}
                                    {% include 'method.swig' with context %}
                                {% else %}
                                    {% include 'nonmethod.swig' with context %}
                                {% endif %}
                            {% endfor %}
                        {% elif doc.kind === 'class' %}
                            {% set context = { doc: doc } %}
                            {% if doc.kind === 'class' %}
                                {% include 'method.swig' with context %}
                            {% else %}
                                {% include 'nonmethod.swig' with context %}
                            {% endif %}
                        {% endif %}

                        {% block symbol-details %}
                            <dl {{ cssclass('!dl-compact') }}>
                                {% block symbol-augments %}
                                    {% include 'includes/lists/augments.swig' with doc %}
                                {% endblock %}

                                {% block symbol-mixes %}
                                    {% include 'includes/lists/mixes.swig' with doc %}
                                {% endblock %}

                                {% block symbol-requires %}
                                    {% include 'includes/lists/requires.swig' with doc %}
                                {% endblock %}
                            </dl>
                        {% endblock %}
                    </section>
                {% endblock %}

                {# TODO: use one set of code for classes/namespaces/properties/methods/typedefs/events #}
                {% block symbol-classes %}
                    {% set classes = members[CATEGORIES.CLASSES] %}
                    {% if classes && classes.length %}
                        <section id="classes">
                            <h>{{ translate('headings.classes', classes.length) }}</h>
                            <section>
                                {% for klass in classes %}
                                    <h>{{ link(klass.longname, klass.name)|safe }}</h>
                                    {% if klass.summary %}
                                        <p>{% include 'includes/summary.swig' with klass %}</p>
                                    {% endif %}
                                    {% block class-source %}
                                        {{ macros.sourcefile(klass) }}
                                    {% endblock %}
                                {% endfor %}
                            </section>
                        </section>
                    {% endif %}
                {% endblock %}

                {% block symbol-namespaces %}
                    {% set namespaces = members[CATEGORIES.NAMESPACES] %}
                    {% if namespaces && namespaces.length %}
                        <section id="namespaces">
                            <h>{{ translate('headings.namespaces', namespaces.length) }}</h>
                            <section>
                                {% for namespace in namespaces %}
                                    <h>{{ link(namespace.longname, namespace.name)|safe }}</h>
                                    {% if namespace.summary %}
                                        <p>{% include 'includes/summary.swig' with namespace %}</p>
                                    {% endif %}
                                    {% block namespace-source %}
                                        {{ macros.sourcefile(namespace) }}
                                    {% endblock %}
                                {% endfor %}
                            </section>
                        </section>
                    {% endif %}
                {% endblock %}

                {# TODO: should use this or properties.swig, not both #}
                {% block symbol-properties %}
                    {% set context = { properties: members[CATEGORIES.MEMBERS] } %}
                    {% if context.properties && context.properties.length %}
                        <section id="properties">
                            <h>{{ translate('headings.properties', context.properties.length) }}</h>
                            <section>
                                {% include 'properties.swig' with context %}
                            </section>
                        </section>
                    {% endif %}
                {% endblock %}

                {% block symbol-methods %}
                    {% set methods = members[CATEGORIES.FUNCTIONS] %}
                    {% if methods && methods.length %}
                        <section id="methods">
                            <h>{{ translate('headings.methods', methods.length) }}</h>
                            <section>
                                {% for method in methods %}
                                    {% set context = { doc: method } %}
                                    {% include 'method.swig' with context %}
                                {% endfor %}
                            </section>
                        </section>
                    {% endif %}
                {% endblock %}

                {# TODO: confusing to use "method.swig" for typedefs/events #}
                {% block symbol-typedefs %}
                    {% set typedefs = members[CATEGORIES.TYPEDEFS] %}
                    {% if typedefs && typedefs.length %}
                        <section id="typedefs">
                            <h>{{ translate('headings.typedefs', typedefs.length) }}</h>
                            <section>
                                {% for typedef in typedefs %}
                                    {% if containsFunctionType(typedef.type) %}
                                        {% set context = { doc: typedef } %}
                                        {% include 'method.swig' with context %}
                                    {% else %}
                                        {# TODO: this appears to be broken; properties.swig only looks for properties array #}
                                        {% set context = { doc: typedef } %}
                                        {% include 'properties.swig' with context %}
                                    {% endif %}
                                {% endfor %}
                            </section>
                        </section>
                    {% endif %}
                {% endblock %}

                {# TODO: confusing to use "method.swig" for typedefs/events #}
                {% block symbol-events %}
                    {% set events = members[CATEGORIES.EVENTS] %}
                    {% if events && events.length %}
                        <section id="events">
                            <h>{{ translate('headings.events', events.length) }}</h>
                            <section>
                                {% for method in events %}
                                    {% set context = { doc: method } %}
                                    {% include 'method.swig' with context %}
                                {% endfor %}
                            </section>
                        </section>
                    {% endif %}
                {% endblock %}
            {% endblock %}
        </section>
    {% endfor %}
{% endblock %}
