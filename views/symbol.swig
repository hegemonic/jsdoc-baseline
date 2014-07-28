{% extends 'layout.swig' %}
{% import 'macros.swig' as macros %}

{% macro membersSummary(members, headingKey) %}
    {% if members && members.length %}
        {% block symbol-members-summary %}
            <section>
                {% block symbol-members-summary-heading %}
                    <h>{{ translate('headings.' + headingKey, members.length) }}</h>
                {% endblock %}

                {% block symbol-members-summary-content %}
                    <section>
                        {% for member in members %}
                            <h>{{ link(member.longname, member.name)|safe }}</h>
                            {% if member.summary %}
                                <p>{% include 'includes/summary.swig' with member %}</p>
                            {% endif %}
                            {% block symbol-members-summary-source %}
                                {{ macros.sourcefile(member) }}
                            {% endblock %}
                        {% endfor %}
                    </section>
                {% endblock %}
            </section>
        {% endblock %}
    {% endif %}
{% endmacro %}

{% macro membersDetail(members, headingKey) %}
    {% if members && members.length %}
        {% block symbol-members-detail %}
            <section>
                {% block symbol-members-detail-heading %}
                    <h>{{ translate('headings.' + headingKey, members.length) }}</h>
                {% endblock %}

                {% block symbol-members-detail-content %}
                    <section>
                        {% for member in members %}
                            {#
                                TODO: confusing to use 'method.swig' for typedefs/events;
                                also, this logic belongs elsewhere
                            #}
                            {%
                                if containsFunctionType(member.type) || member.kind === 'event' ||
                                    member.kind === 'function'
                            %}
                                {% set context = { doc: member } %}
                                {% include 'method.swig' with context %}
                            {% else %}
                                {# TODO: working? #}
                                {% set context = { properties: member } %}
                                {% include 'properties.swig' with context %}
                            {% endif %}
                        {% endfor %}
                    </section>
                {% endblock %}
            </section>
        {% endblock %}
    {% endif %}
{% endmacro %}

{% block banner %}{% endblock %}

{% block main-content %}
    {% for doc in docs %}
        <section>
            {% resetheadinglevel -%}
            {%- block symbol-header -%}
                <header {{ cssClass('!page-header') }}>
                    {%- block symbol-header-heading -%}
                        <div>
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
                        </div>
                    {%- endblock -%}

                    {%- block symbol-header-classdesc -%}
                        {%- if doc.classdesc %}
                            <div {{ cssClass('!symbol-classdesc') }}>
                                {{ doc.classdesc|markdown }}
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

            {%- block symbol -%}
                {%- block symbol-overview %}
                    <section id="overview">
                        {#
                            If a module exports only one symbol, document the symbol here, since
                            it's not a member of anything else.
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
                        {# Classes also need additional docs, beyond what's in the header. #}
                        {% elif doc.kind === 'class' %}
                            {% set context = { doc: doc } %}
                            {% include 'method.swig' with context %}
                        {% endif %}
                    </section>
                {% endblock %}

                {% block symbol-classes %}
                    {% set classes = members[CATEGORIES.CLASSES] %}
                    {{ membersSummary(classes, CATEGORIES.CLASSES) }}
                {% endblock %}

                {% block symbol-namespaces %}
                    {% set namespaces = members[CATEGORIES.NAMESPACES] %}
                    {{ membersSummary(namespaces, CATEGORIES.NAMESPACES) }}
                {% endblock %}

                {% block symbol-properties %}
                    {% set context = { properties: members[CATEGORIES.MEMBERS] } %}
                    {% include 'properties.swig' with context %}
                {% endblock %}

                {% block symbol-methods %}
                    {% set methods = members[CATEGORIES.FUNCTIONS] %}
                    {{ membersDetail(methods, CATEGORIES.FUNCTIONS) }}
                {% endblock %}

                {% block symbol-typedefs %}
                    {% set typedefs = members[CATEGORIES.TYPEDEFS] %}
                    {{ membersDetail(typedefs, CATEGORIES.TYPEDEFS) }}
                {% endblock %}

                {% block symbol-events %}
                    {% set events = members[CATEGORIES.EVENTS] %}
                    {{ membersDetail(events, CATEGORIES.EVENTS) }}
                {% endblock %}
            {% endblock %}
        </section>
    {% endfor %}
{% endblock %}
