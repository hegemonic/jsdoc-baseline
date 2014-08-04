{% for doc in docs %}
    {% if category === CATEGORIES.CLASSES %}
        {% set headingKey = 'headings.constructors' %}
        {% set headingDocs = docs %}
    {% elif category === CATEGORIES.MODULES %}
        {% set headingKey = 'headings.exports' %}
        {% set headingDocs = doc.exports %}
    {% endif %}
    {# Show the top-level heading/summary only once #}
    {% if loop.first %}
        {% set context = {
            category: category,
            doc: doc,
            docs: docs,
            headingDocs: headingDocs,
            headingKey: headingKey,
            members: members
        } %}
        {% include 'includes/symbolheader.swig' with context only %}

        {# Summary lists of all members #}
        {% include 'includes/components/summaryblocks.swig' with context only %}

        {# Heading identifying the things we're about to list #}
        <section>
            {% if category === CATEGORIES.CLASSES %}
                <h>{{ translate('headings.constructors', docs.length) }}</h>
            {% elif doc.exports %}
                <h>{{ translate('headings.exports', docs.length) }}</h>
            {% endif %}
    {% endif %}

            {#
                If a module exports only one symbol, document the symbol here, since
                it's not a member of anything else.
            #}
            {% if doc.kind === 'module' && doc.exports %}
                {% for moduleExports in doc.exports %}
                    {% set context = { doc: moduleExports } %}
                    <section>
                        {% include 'symbol-detail.swig' with context only %}
                    </section>
                {% endfor %}
            {# Classes also need additional docs, beyond what's in the header. #}
            {% elif doc.kind === 'class' %}
                {% set context = { doc: doc } %}
                <section>
                    {% include 'symbol-detail.swig' with context only %}
                </section>
            {% endif %}
    {% if loop.last %}
        </section>
    {% endif %}
{% endfor %}
