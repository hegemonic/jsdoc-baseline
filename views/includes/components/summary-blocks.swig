{% if config('components.summary') %}
    <section id="summary">
        {% block symbol-summary-constructors %}
            {# TODO: add this after issue #50 is fixed #}
        {% endblock %}

        {% block symbol-summary-classes %}
            {% set summaryTitle =
                translate('childrenHeadings.' + CATEGORIES.CLASSES,
                symbolClasses.length) %}
            {% set context = {
                summaryItems: symbolClasses,
                summaryHeading: summaryTitle
            } %}
            {% include 'summary-callout.swig' with context %}
        {% endblock %}

        {% block symbol-summary-namespaces %}
            {% set summaryTitle = translate('headings.' + CATEGORIES.NAMESPACES,
                symbolNamespaces.length) %}
            {% set context = {
                summaryItems: symbolNamespaces,
                summaryHeading: summaryTitle
            } %}
            {% include 'summary-callout.swig' with context %}
        {% endblock %}

        {% block symbol-summary-properties %}
            {% set summaryTitle = translate('headings.' + CATEGORIES.PROPERTIES,
                symbolProperties.length) %}
            {% set context = {
                summaryItems: symbolProperties,
                summaryHeading: summaryTitle
            } %}
            {% include 'summary-callout.swig' with context %}
        {% endblock %}

        {% block symbol-summary-methods %}
            {% set summaryTitle = translate('headings.' + CATEGORIES.FUNCTIONS,
                symbolMethods.length) %}
            {% set context = {
                summaryItems: symbolMethods,
                summaryHeading: summaryTitle
            } %}
            {% include 'summary-callout.swig' with context %}
        {% endblock %}

        {% block symbol-summary-typedefs %}
            {% set summaryTitle = translate('headings.' + CATEGORIES.TYPEDEFS,
                symbolTypedefs.length) %}
            {% set context = {
                summaryItems: symbolTypedefs,
                summaryHeading: summaryTitle
            } %}
            {% include 'summary-callout.swig' with context %}
        {% endblock %}

        {% block symbol-summary-events %}
            {% set summaryTitle = translate('headings.' + CATEGORIES.EVENTS,
                symbolEvents.length) %}
            {% set context = {
                summaryItems: symbolEvents,
                summaryHeading: summaryTitle
            } %}
            {% include 'summary-callout.swig' with context %}
        {% endblock %}
    </section>
{% endif %}
