{# TODO: get rid of this, or move to lists #}
{#
	TODO: if we keep this, would be nice for it to use meta instead of doc.meta; would make
	some includes clearer, including the one in symbol-detail.swig.
#}
{% if config('outputSourceFiles') && doc.meta && doc.meta.filename && doc.meta.lineno %}
    {# TODO: or "inherited from" or "mixed in from"? #}
    <dt>{{ translate('headings.definedIn') }}</dt>
    {% set context = { doc: doc } %}
    <dd>{% include 'sourcelink.swig' with context only %}</dd>
{% endif %}

